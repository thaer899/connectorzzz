import os
import requests
from src.agents.tools.functions.procurement.approver import review_purchase_request, authorize_payment, audit_procurement
from src.agents.tools.functions.procurement.purchaser import track_order, finalize_purchase, initiate_negotiation
from src.agents.tools.functions.procurement.requestor import submit_item_request, update_request_details, cancel_request
from src.agents.tools.functions.misc.functions import spr_writer, spr_reader, browse_web, invoke_github_actions_pipeline, get_user_profile
from src.agents.tools.driver_manager import DriverManager
from src.config import GITHUB_TOKEN
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import time
from contextlib import contextmanager
from src.config import SELENIULM_LOCAL


def register_functions(instance_agent):
    instance_agent.register_function(
        function_map={
            "spr_writer": spr_writer,
            "spr_reader": spr_reader,
            "get_user_profile": get_user_profile,
            "gitops_browse_web": browse_web,
            "gitops_invoke_github_actions_pipeline": invoke_github_actions_pipeline,
            "procure_requestor_submit_item_request": submit_item_request,
            "procure_requestor_update_request_details": update_request_details,
            "procure_requestor_cancel_request": cancel_request,
            "procure_purchaser_initiate_negotiation": initiate_negotiation,
            "procure_purchaser_finalize_purchase": finalize_purchase,
            "procure_purchaser_track_order": track_order,
            "procure_approver_review_purchase_request": review_purchase_request,
            "procure_approver_authorize_payment": authorize_payment,
            "procure_approver_audit_procurement": audit_procurement,
        }
    )
